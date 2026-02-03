//chapter2_5/state.js
export const state = {
  index: 0,
  prevIndex: null,
  showingText: false
};

export function resetTextState() {
  state.showingText = false;
}
