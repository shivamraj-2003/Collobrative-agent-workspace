export const dummyMessages = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  sender: i % 2 === 0 ? 'Agent' : 'User',
  content: `Message ${i + 1}`,
}));
