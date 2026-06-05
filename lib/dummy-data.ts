export const dummyUser = {
  id: "user-1",
  name: "김지은",
  email: "user@example.com",
  phone: "010-1234-5678",
};

export const dummyGroups = [
  {
    id: "group-1",
    name: "주말 등산 동호회",
    description: "매주 주말 서울 근처 산 등산",
    member_count: 12,
    max_members: 20,
    owner_id: "user-1",
    next_event_title: "북한산 등산",
    next_event_at: "2026-06-08T08:00:00Z",
    created_at: "2026-05-01T00:00:00Z",
    updated_at: "2026-05-01T00:00:00Z",
  },
  {
    id: "group-2",
    name: "헬스 운동 모임",
    description: "함께 헬스장에서 운동하는 모임",
    member_count: 8,
    max_members: 15,
    owner_id: "user-2",
    next_event_title: "월요일 PT",
    next_event_at: "2026-06-02T19:00:00Z",
    created_at: "2026-05-02T00:00:00Z",
    updated_at: "2026-05-02T00:00:00Z",
  },
];

export const dummyEvents = [
  {
    id: "event-1",
    group_id: "group-1",
    title: "북한산 등산",
    description: "북한산 정상까지 등산",
    date: "2026-06-08",
    time: "08:00",
    location: "북한산 입구",
    max_participants: 20,
    participant_count: 12,
    waiting_count: 0,
    fee: 5000,
    carpool_enabled: true,
    created_at: "2026-05-01T00:00:00Z",
    updated_at: "2026-05-01T00:00:00Z",
  },
  {
    id: "event-2",
    group_id: "group-1",
    title: "산악자전거 라이딩",
    description: "산악자전거 라이딩",
    date: "2026-06-15",
    time: "10:00",
    location: "여의도 한강공원",
    max_participants: 15,
    participant_count: 15,
    waiting_count: 3,
    fee: 0,
    carpool_enabled: false,
    created_at: "2026-05-02T00:00:00Z",
    updated_at: "2026-05-02T00:00:00Z",
  },
];

export const dummyParticipants = [
  {
    id: "participant-1",
    event_id: "event-1",
    user_id: "user-1",
    status: "confirmed",
    fee_paid: true,
  },
  {
    id: "participant-2",
    event_id: "event-1",
    user_id: "user-3",
    status: "confirmed",
    fee_paid: false,
  },
];

export const dummyCarPoolDrivers = [
  {
    id: "driver-1",
    event_id: "event-1",
    driver_name: "김지은",
    departure_location: "강남역",
    available_seats: 3,
  },
];

export const dummyCarPoolPassengers = [
  {
    id: "passenger-1",
    event_id: "event-1",
    user_id: "user-3",
    driver_id: "driver-1",
    status: "confirmed",
  },
];
