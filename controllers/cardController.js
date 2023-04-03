const cardModel = require('../database/models/cardModel');
const logger = require('../logger');
const { getSortedCardsList } = require('../helpers/cardHelper');

class CardController {
    constructor(req, res) {
        this.res = res;
        this.req = req;
    }

    async getCards() {
        const { req, res } = this;
        logger.info(`------------- GET CARDS DATA ------------`)
        try {
            let cards = await cardModel.find();
            if (cards) {
                cards = await getSortedCardsList(cards);
                res.send({ status: 200, data: cards });
            } else {
                res.send({ status: 200, data: [] })
            }
        } catch (e) {
            logger.error(`Error while fetching cards data: ${e}`)
            res.status(400).send({ status: false, error: "Error while fetching cards data" })
        }
    }

    async createCard() {
        logger.info(`------------- ADD CART DATA TO DATABASE ------------`)

        const { req, res } = this;

        const { cardId, cardContent, status, index} = req.body;
        try {
            let result = await cardModel.findOne({ _id: cardId })

            if (result) {
                res.status(400).send({ status: 400, error: "Cannot Add to Card. Already Exists" });
            } else {
                let cardObject = {
                    _id: cardId,
                    cardId: cardId,
                    cardContent: cardContent,
                    status: status,
                    priority: index,
                }
                const newCard = new cardModel(cardObject);
                let savedCard = newCard.save();
                if (savedCard) {
                    res.send({ status: 200, data: savedCard, msg: "Card Added Successfully" });
                    logger.info(`Card added Successfully.`)
                }
                else {
                    logger.error(`Cannot Add to Card`)
                    res.status(400).send({ status: 400, error: "Cannot Add to Card" });
                }
            }
        } catch (e) {
            logger.error(`Error while Adding to Card ${e}`)
            res.status(400).send({ status: false, error: "Error while Adding to Card" })
        }
    }

    async deleteCard() {
        logger.info(`-------------DELETE CARD DATA TO DATABASE ------------`)

        const { req, res } = this;
        const { cardId } = req.body;
        try {
            const result = await cardModel.deleteOne({ _id: cardId })
            if (result.deletedCount === 1) {
                res.send({ status: 200, msg: `Card has been deleted successfully` });
                logger.info(`Card has been deleted successfully`)
            }
            else {
                logger.error(`Error deleting Card`)
                res.status(400).send({ status: 400, error: "Error deleting Cart" });
            }
        } catch (e) {
            res.status(400).send({ status: false, error: "Error while deleting Card" })
            logger.error(`Error while deleting Card ${e}`)
        }
    }

    async updatedCard() {
        logger.info(`-------------UPDATE CARD DATA TO DATABASE ------------`)

        const { req, res } = this;
        const { cardId, cardContent, status, cardIndex } = req.body;
        try {
            let result = await cardModel.findOne({ _id: cardId })

            if (result) {
                const updatedCardObj = {
                    cardContent: cardContent ? cardContent : result.cardContent,
                    priority: typeof cardIndex === 'number' ? cardIndex : result.priority,
                    status: status ? status : result.status,
                }
                const updatedCard = await cardModel.updateOne({ _id: cardId }, updatedCardObj)
                if (updatedCard) {
                    logger.info(`Card details updated successfully`)
                    res.send({ status: 200, msg: "Card details updated successfully" });
                } else {
                    logger.debug(`Card details updation Failed`)
                    res.send({ status: 400, msg: `Card details updation Failed` })
                }
               
            } else {
                res.send({ status: 400, error: "Could not Update Details of Card. Card not found" });
            }
        } catch (e) {
            logger.debug(`Error while Updating Card details >>> ${e}`)
            res.send({ status: 400, msg: `Error while Updating Card details` })
        }
    }

    async updatedAllCardsDetails() {
        logger.info(`-------------UPDATE CARD DATA TO DATABASE ------------`)

        const { req, res } = this;
        const { lists } = req.body;
        let promises = await Promise.all(lists.map(async (list) => {
            if (list.cards.length) {
              await Promise.all(list.cards.map(async (card, index) => {
                try {
                    let result = await cardModel.findOne({ _id: card.id })
        
                    if (result) {
                        const updatedCardObj = {
                            cardContent: card.content ? card.content : result.cardContent,
                            priority: index,
                            status: list.id ? list.id : result.status,
                        }
                        await cardModel.updateOne({ _id: card.id }, updatedCardObj)
                       
                    } 
                } catch (e) {
                    logger.debug(`Error while Updating Card details >>> ${e}`)
                }
              }))
            }
          }))
          if (promises){
            res.send({ status: 200, msg: "Cards details updated successfully" });
          } else {
            res.send({ status: 400, msg: "Cards details updation failed" });
          }
    }
}

module.exports = CardController;
