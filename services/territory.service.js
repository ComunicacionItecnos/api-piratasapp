const mongoose = require('mongoose');
const categoryTerritorySchema = require('../schemas/catTerritory.schema');
const modelCategory = mongoose.model('catTerritory', categoryTerritorySchema);

class memberService {
    async findCategory() {
        const result = await modelCategory.find().exec();
        return await result
    }

    async createCategory(data, idUser) {
        data.userEdit = idUser;
        const result = await new modelCategory({ ...data });
        await result.save();
        return await result;
    }


}

module.exports = memberService;
