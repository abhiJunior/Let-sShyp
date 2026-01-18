const VALID_TRANSITIONS = {
  'CREATED': ['ASSIGNED', 'CANCELLED'],
  'ASSIGNED': ['PICKED_UP', 'CANCELLED'],
  'PICKED_UP': ['IN_TRANSIT'],
  'IN_TRANSIT': ['DELIVERED'],
  'DELIVERED': [],
  'CANCELLED': []
};

const isValidTransition = (currentState, nextState) => {
  return VALID_TRANSITIONS[currentState]?.includes(nextState);
};

export default isValidTransition