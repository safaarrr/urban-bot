const userStates = new Map();

export function setUserState(phone, data) {
    userStates.set(phone, data);
}

export function getUserState(phone) {
    return userStates.get(phone);
}

export function clearUserState(phone) {
    userStates.delete(phone);
}
