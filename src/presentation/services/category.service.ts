import { CategoryModel } from '../../data';
import { CreateCategoryDto, CustomError, UserEntity } from '../../domain';



export class CategoryService {

    // DI
    constructor(){}

    async createCategory( createCategoryDto: CreateCategoryDto, user: UserEntity) {

        const categoryExists = await CategoryModel.findOne({name: createCategoryDto.name})
        if (categoryExists) throw CustomError.badRequest('Category alredy exists')

            try {
                const category = await new CategoryModel({
                    ...createCategoryDto,
                    user: user.id
                })

            await  category.save()
            return {
                id: category.id,
                name: category.name,
                available: category.available   
            }



            } catch (error) {
                throw CustomError.internalServer(`${error}`)
            }
        
    }
    async getCategories( ) {

        try {
            
            const categories = await CategoryModel.find()

            return categories.map( category => {
                const {name, available, _id: id} = category

                return {
                    id,
                    name,
                    available
                }

            })

        } catch (error) {

            throw CustomError.internalServer(`${error}`)
            
        }
    }


}