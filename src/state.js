export const state = {
  username: "Stranger",
  currentDir: "",
  changeCurrentDir: async (dir) => (state.currentDir = dir),
};
