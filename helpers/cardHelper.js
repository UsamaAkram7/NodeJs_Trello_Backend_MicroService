const { CARD_STATUS } = require("../definitions/card");

const sortCardArray = async (cards) => {
  let sortedCards = await cards.sort((a, b) => {
    return a.priority - b.priority;
  });
  return sortedCards;
};

const getSortedCardsList = async (cards) => {
  let todoArray = [];
  let doingArray = [];
  let doneArray = [];
  let sortedTodoArray = [];
  let sortedDoingArray = [];
  let sortedDoneArray = [];
  await cards.forEach((card) => {
    if (card.status === CARD_STATUS.TODO) {
      todoArray.push(card);
    } else if (card.status === CARD_STATUS.DOING) {
      doingArray.push(card);
    } else if (card.status === CARD_STATUS.DONE) {
      doneArray.push(card);
    }
  });
  sortedTodoArray = await sortCardArray(todoArray);
  sortedDoingArray = await sortCardArray(doingArray);
  sortedDoneArray = await sortCardArray(doneArray);
 let sortedList = sortedTodoArray.concat(sortedDoingArray, sortedDoneArray);
 return sortedList;
};

module.exports = {
  sortCardArray,
  getSortedCardsList,
};
