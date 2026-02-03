// utils/state.js

export const state = {
  index: 0,
  prevIndex: null,
  showingText: false
};

export function resetTextState() {
  state.showingText = false;
}

export function updateState(newState) {
  Object.assign(state, newState);  // stateオブジェクトを更新
}

