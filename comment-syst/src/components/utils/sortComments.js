export default function sortComments(comments, sortBy) {
    if (sortBy === 'latest') {
      return comments.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortBy === 'popularity') {
      return comments.sort((a, b) => {
        const aReactions = a.reactions.like - a.reactions.dislike;
        const bReactions = b.reactions.like - b.reactions.dislike;
        return bReactions - aReactions;
      });
    }
  }
  