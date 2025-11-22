"use client";

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Calendar, CheckSquare, Square, User, Users } from 'lucide-react';

const reportPrefixes = [
  { value: '#LJR-', label: 'Life Journey Report', code: 'LJR' },
  { value: '#LCR-', label: 'Life Changing Report', code: 'LCR' },
  { value: '#KM-', label: 'Kundli Matching Report', code: 'KM' },
  { value: '#LR-', label: 'Love Report', code: 'LR' },
];

interface Astrologer {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  reportTypes: string[];
}

interface Slot {
  time: string;
  capacity: number;
  availableAstrologers: Array<{ _id: string; name: string }>;
  isAvailable: boolean;
  isBlocked?: boolean;
  blockedSlotId?: string | null;
  reason?: string;
  blockedBy?: string;
}

export default function BlockedSlotsManagement() {
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    return tomorrow.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState(getTomorrowDate());
  const [selectedPrefix, setSelectedPrefix] = useState('#LJR-');
  const [selectedAstrologer, setSelectedAstrologer] = useState<string>('all');
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [loadingAstrologers, setLoadingAstrologers] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingSlots, setProcessingSlots] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [bulkProcessing, setBulkProcessing] = useState(false);

  const getNext10Days = () => {
    const dates = [];
    for (let i = 0; i < 10; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i + 2);
      dates.push({
        date: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        fullLabel: date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
      });
    }
    return dates;
  };

  const next10Days = getNext10Days();

  const fetchSlots = async () => {
    if (!selectedDate || !selectedPrefix) return;
    setLoading(true);
    try {
      // Build params
      const params = new URLSearchParams({
        date: selectedDate,
        prefix: selectedPrefix
      });

      if (selectedAstrologer !== 'all') {
        params.append('astrologerId', selectedAstrologer);
      }

      // Fetch available slots
      const availableResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/life-journey-report/available-consultation-slots?${params.toString()}`
      );
      const availableData = await availableResponse.json();

      if (!availableData.success) {
        toast.error(availableData.message || "Failed to fetch slots");
        setSlots([]);
        setAstrologers([]);
        setLoading(false);
        return;
      }

      // Update astrologers list from API response
      if (availableData.astrologers) {
        setAstrologers(availableData.astrologers);
      }

      // Fetch blocked slots
      const blockedParams = new URLSearchParams({
        date: selectedDate,
        prefix: selectedPrefix
      });

      if (selectedAstrologer !== 'all') {
        blockedParams.append('astrologerId', selectedAstrologer);
      } else {
        blockedParams.append('astrologerId', 'global');
      }

      const blockedResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/life-journey-report/blocked-slots?${blockedParams.toString()}`
      );
      const blockedData = await blockedResponse.json();

      const availableSlots = availableData.slots || [];
      const blockedSlots = blockedData.success ? blockedData.blockedSlots || [] : [];

      // Create map of blocked slots
      const blockedSlotsMap = new Map();
      blockedSlots.forEach((slot: any) => {
        blockedSlotsMap.set(slot.timeRange, {
          id: slot._id,
          isActive: slot.isActive,
          reason: slot.reason,
          blockedBy: slot.blockedBy,
          prefix: slot.prefix,
          astrologerId: slot.astrologerId?._id,
          astrologerName: slot.astrologerId?.astrologerName
        });
      });

      // Combine all time ranges
      const allTimeRanges = new Set<string>();
      availableSlots.forEach((slot: any) => allTimeRanges.add(slot.time));
      blockedSlots.forEach((slot: any) => allTimeRanges.add(slot.timeRange));

      // Generate all possible slots if none exist
      if (allTimeRanges.size === 0) {
        const allPossibleSlots = generateAllTimeSlots();
        allPossibleSlots.forEach(slot => allTimeRanges.add(slot));
      }

      // Map to slot objects
      const allSlots = Array.from(allTimeRanges).sort().map(timeRange => {
        const availableSlot = availableSlots.find((s: any) => s.time === timeRange);
        const blockedInfo = blockedSlotsMap.get(timeRange);

        return {
          time: timeRange,
          capacity: availableSlot?.capacity || 0,
          availableAstrologers: availableSlot?.availableAstrologers || [],
          isAvailable: availableSlot ? true : false,
          isBlocked: blockedInfo ? true : false,
          blockedSlotId: blockedInfo?.id || null,
          isActive: blockedInfo?.isActive ?? true,
          reason: blockedInfo?.reason,
          blockedBy: blockedInfo?.blockedBy,
          astrologerName: blockedInfo?.astrologerName
        };
      });

      setSlots(allSlots);
    } catch (error) {
      console.error('Error fetching slots:', error);
      toast.error("Failed to fetch slots");
    } finally {
      setLoading(false);
    }
  };

  // Generate all time slots (20 min + 5 min break)
  const generateAllTimeSlots = () => {
    const slots = [];
    let currentMinute = 10 * 60; // 10 AM
    const endMinute = 19 * 60; // 7 PM

    while (currentMinute < endMinute) {
      const startHour = Math.floor(currentMinute / 60);
      const startMin = currentMinute % 60;
      const endTime = currentMinute + 20; // 20 minute slot
      const endHour = Math.floor(endTime / 60);
      const endMin = endTime % 60;

      if (endTime > endMinute) break;

      const formatTime = (h: number, m: number) => {
        const period = h >= 12 ? 'PM' : 'AM';
        const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
        return `${hour12}:${String(m).padStart(2, '0')}${period}`;
      };

      slots.push(`${formatTime(startHour, startMin)}-${formatTime(endHour, endMin)}`);
      currentMinute += 25; // 20 min slot + 5 min break
    }

    return slots;
  };

  useEffect(() => {
    fetchSlots();
    setSelectionMode(false);
    setSelectedSlots(new Set());
  }, [selectedDate, selectedPrefix, selectedAstrologer]);

  const handleBlock = async (timeRange: string) => {
    setProcessingSlots(prev => new Set(prev).add(timeRange));
    setSlots(prevSlots =>
      prevSlots.map(slot =>
        slot.time === timeRange
          ? { ...slot, isBlocked: true, blockedSlotId: 'temp-id' }
          : slot
      )
    );

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/life-journey-report/blocked-slots`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: selectedDate,
            timeRange,
            prefix: selectedPrefix,
            astrologerId: selectedAstrologer === 'all' ? null : selectedAstrologer,
            blockedBy: 'Admin'
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSlots(prevSlots =>
          prevSlots.map(slot =>
            slot.time === timeRange
              ? { 
                  ...slot, 
                  isBlocked: true, 
                  blockedSlotId: data.blockedSlot?._id,
                  reason: data.blockedSlot?.reason,
                  blockedBy: data.blockedSlot?.blockedBy,
                  astrologerName: data.blockedSlot?.astrologerId?.astrologerName
                }
              : slot
          )
        );
        toast.success("Slot blocked successfully");
        return true;
      } else {
        toast.error(data.message || "Failed to block slot");
        setSlots(prevSlots =>
          prevSlots.map(slot =>
            slot.time === timeRange
              ? { ...slot, isBlocked: false, blockedSlotId: null }
              : slot
          )
        );
        return false;
      }
    } catch (error) {
      console.error('Error blocking slot:', error);
      toast.error("An error occurred while blocking slot");
      setSlots(prevSlots =>
        prevSlots.map(slot =>
          slot.time === timeRange
            ? { ...slot, isBlocked: false, blockedSlotId: null }
            : slot
        )
      );
      return false;
    } finally {
      setProcessingSlots(prev => {
        const newSet = new Set(prev);
        newSet.delete(timeRange);
        return newSet;
      });
    }
  };

  const handleUnblock = async (blockedSlotId: string, timeRange: string) => {
    if (!blockedSlotId || blockedSlotId === 'temp-id') {
      toast.error("Invalid slot ID");
      return false;
    }

    setProcessingSlots(prev => new Set(prev).add(timeRange));
    setSlots(prevSlots =>
      prevSlots.map(slot =>
        slot.time === timeRange
          ? { ...slot, isBlocked: false, blockedSlotId: null }
          : slot
      )
    );

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/life-journey-report/blocked-slots/${blockedSlotId}`,
        { method: 'DELETE' }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Slot unblocked successfully");
        return true;
      } else {
        toast.error(data.message || "Failed to unblock slot");
        setSlots(prevSlots =>
          prevSlots.map(slot =>
            slot.time === timeRange
              ? { ...slot, isBlocked: true, blockedSlotId: blockedSlotId }
              : slot
          )
        );
        return false;
      }
    } catch (error) {
      console.error('Error unblocking slot:', error);
      toast.error("An error occurred while unblocking");
      setSlots(prevSlots =>
        prevSlots.map(slot =>
          slot.time === timeRange
            ? { ...slot, isBlocked: true, blockedSlotId: blockedSlotId }
            : slot
        )
      );
      return false;
    } finally {
      setProcessingSlots(prev => {
        const newSet = new Set(prev);
        newSet.delete(timeRange);
        return newSet;
      });
    }
  };

  const toggleSelectionMode = () => {
    if (!selectionMode) {
      const allSlotTimes = slots.map(slot => slot.time);
      setSelectedSlots(new Set(allSlotTimes));
      setSelectionMode(true);
    } else {
      setSelectionMode(false);
      setSelectedSlots(new Set());
    }
  };

  const toggleSlotSelection = (timeRange: string) => {
    setSelectedSlots(prev => {
      const newSet = new Set(prev);
      if (newSet.has(timeRange)) {
        newSet.delete(timeRange);
      } else {
        newSet.add(timeRange);
      }
      return newSet;
    });
  };

  const handleBulkAction = async (action: 'block' | 'unblock') => {
    if (selectedSlots.size === 0) {
      toast.error("Please select at least one slot");
      return;
    }

    setBulkProcessing(true);
    let successCount = 0;
    let failCount = 0;

    const selectedSlotsArray = Array.from(selectedSlots);
    
    for (const timeRange of selectedSlotsArray) {
      const slot = slots.find(s => s.time === timeRange);
      if (!slot) continue;

      if (action === 'block' && !slot.isBlocked) {
        const success = await handleBlock(timeRange);
        if (success) successCount++;
        else failCount++;
      } else if (action === 'unblock' && slot.isBlocked && slot.blockedSlotId) {
        const success = await handleUnblock(slot.blockedSlotId, timeRange);
        if (success) successCount++;
        else failCount++;
      }
    }

    setBulkProcessing(false);
    
    if (successCount > 0) {
      toast.success(`${successCount} slot(s) ${action === 'block' ? 'blocked' : 'unblocked'} successfully!`);
    }
    if (failCount > 0) {
      toast.error(`${failCount} slot(s) failed to ${action}`);
    }

    setSelectedSlots(new Set());
    setSelectionMode(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const selectedBlockedCount = Array.from(selectedSlots).filter(timeRange => {
    const slot = slots.find(s => s.time === timeRange);
    return slot?.isBlocked;
  }).length;

  const selectedUnblockedCount = selectedSlots.size - selectedBlockedCount;

  const currentAstrologerName = selectedAstrologer === 'all' 
    ? 'All Astrologers (General Availability)' 
    : astrologers.find(a => a._id === selectedAstrologer)?.name || 'Unknown';

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <Card className="mb-6 p-6 bg-[#EF4444] text-white border-none shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Slot Management Dashboard
              </h1>
              <p className="text-white/90 text-sm md:text-base">
                Manage report consultation time slots and astrologer availability
              </p>
            </div>
          </div>
        </Card>

        <Card className="mb-6 p-6 border-gray-200 bg-white shadow-md">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Report Type */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2  flex items-center gap-2">
                  <span className="text-[#EF4444]">1.</span> Report Type
                </label>
                <Select value={selectedPrefix} onValueChange={(value) => {
                  setSelectedPrefix(value);
                  setSelectedAstrologer('all'); // Reset astrologer when report changes
                }}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {reportPrefixes.map((prefix) => (
                      <SelectItem key={prefix.value} value={prefix.value}>
                        {prefix.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2  flex items-center gap-2">
                  <span className="text-[#EF4444]">2.</span> Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={getTomorrowDate()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EF4444]"
                />
              </div>

              {/* Astrologer */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2  flex items-center gap-2">
                  <span className="text-[#EF4444]">3.</span> Astrologer (Optional)
                </label>
                <Select 
                  value={selectedAstrologer} 
                  onValueChange={setSelectedAstrologer}
                  disabled={loadingAstrologers || astrologers.length === 0}
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Select astrologer" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        All Astrologers (General)
                      </div>
                    </SelectItem>
                    {astrologers.map((astrologer) => (
                      <SelectItem key={astrologer._id} value={astrologer._id}>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {astrologer.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {astrologers.length === 0 && !loadingAstrologers && (
                  <p className="text-xs text-orange-600 mt-1">
                    ⚠️ No astrologers assigned to this report type
                  </p>
                )}
              </div>
            </div>

            {/* Quick Date Selection */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                Quick Select Next 10 Days
              </label>
              <div className="flex flex-wrap gap-2">
                {next10Days.map((day) => (
                  <Button
                    key={day.date}
                    variant={selectedDate === day.date ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDate(day.date)}
                    className={`${
                      selectedDate === day.date
                        ? 'bg-[#EF4444] text-white hover:bg-[#DC2626]'
                        : 'border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {day.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Info Banner */}
            {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-blue-600 mt-0.5">ℹ️</div>
                <div className="flex-1">
                  <p className="text-sm text-blue-900 font-medium mb-1">
                    Viewing: {formatDate(selectedDate)}
                  </p>
                  <p className="text-xs text-blue-700">
                    Current filter: <strong>{currentAstrologerName}</strong>
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    💡 Blocking a slot for "All Astrologers" will make it unavailable for everyone. 
                    Blocking for a specific astrologer only affects that individual.
                  </p>
                </div>
              </div>
            </div> */}
          </div>
        </Card>

        {/* Bulk Actions */}
        {!loading && slots.length > 0 && (
          <Card className="mb-4 p-4 border-gray-200 bg-white shadow-md">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={toggleSelectionMode}
                variant="outline"
                className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white"
              >
                {selectionMode ? 'Cancel Selection' : 'Select All'}
              </Button>

              {selectionMode && (
                <>
                  <div className="text-sm text-gray-600">
                    Selected: <span className="font-semibold text-[#EF4444]">{selectedSlots.size}</span> slot(s)
                  </div>
                  
                  {selectedUnblockedCount > 0 && (
                    <Button
                      onClick={() => handleBulkAction('block')}
                      disabled={bulkProcessing}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      {bulkProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        `Block Selected (${selectedUnblockedCount})`
                      )}
                    </Button>
                  )}

                  {selectedBlockedCount > 0 && (
                    <Button
                      onClick={() => handleBulkAction('unblock')}
                      disabled={bulkProcessing}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      {bulkProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        `Unblock Selected (${selectedBlockedCount})`
                      )}
                    </Button>
                  )}
                </>
              )}
            </div>
          </Card>
        )}

        {/* Slots Grid */}
        {loading ? (
          <Card className="p-12 text-center border-gray-200 bg-white">
            <Loader2 className="w-12 h-12 animate-spin text-[#EF4444] mx-auto mb-4" />
            <p className="text-gray-600">Loading slots...</p>
          </Card>
        ) : slots.length === 0 ? (
          <Card className="p-12 text-center border-gray-200 bg-white">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Slots Available
            </h3>
            <p className="text-gray-600">
              No time slots found for the selected date and report type
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {slots.map((slot) => {
              const isProcessing = processingSlots.has(slot.time);
              const isSelected = selectedSlots.has(slot.time);
              
              return (
                <Card
                  key={slot.time}
                  className={`p-4 border-2 transition-all cursor-pointer hover:shadow-md ${
                    isSelected ? 'ring-2 ring-[#EF4444]' : ''
                  } ${
                    slot.isBlocked
                      ? 'bg-red-50 border-red-300'
                      : slot.capacity > 0
                      ? 'bg-green-50 border-green-300'
                      : 'bg-gray-50 border-gray-300'
                  }`}
                  onClick={() => selectionMode && toggleSlotSelection(slot.time)}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2 flex-1">
                        {selectionMode && (
                          <div onClick={(e) => e.stopPropagation()}>
                            {isSelected ? (
                              <CheckSquare 
                                className="w-5 h-5 text-[#EF4444] cursor-pointer flex-shrink-0 mt-0.5" 
                                onClick={() => toggleSlotSelection(slot.time)}
                              />
                            ) : (
                              <Square 
                                className="w-5 h-5 text-gray-400 cursor-pointer flex-shrink-0 mt-0.5" 
                                onClick={() => toggleSlotSelection(slot.time)}
                              />
                            )}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 text-base leading-tight">
                            {slot.time}
                          </p>
                          {/* {!slot.isBlocked && slot.capacity > 0 && (
                            <p className="text-xs text-green-700 mt-1">
                              {slot.capacity} astrologer{slot.capacity > 1 ? 's' : ''} available
                            </p>
                          )} */}
                          {slot.isBlocked && (
                            <p className="text-xs text-red-700 mt-1">
                              🚫 Blocked
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {!selectionMode && (
                        <div className="ml-2 flex-shrink-0">
                          {slot.isBlocked ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (slot.blockedSlotId) {
                                  handleUnblock(slot.blockedSlotId, slot.time);
                                }
                              }}
                              disabled={isProcessing || !slot.blockedSlotId}
                              className="bg-green-500 hover:bg-green-600 text-white border-none text-xs px-2 py-1 h-auto"
                            >
                              {isProcessing ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                'Unblock'
                              )}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBlock(slot.time);
                              }}
                              disabled={isProcessing}
                              className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 h-auto"
                            >
                              {isProcessing ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                'Block'
                              )}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>

                    {slot.isBlocked && slot.reason && (
                      <div className="pt-2 border-t border-red-200">
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Reason:</span> {slot.reason}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
