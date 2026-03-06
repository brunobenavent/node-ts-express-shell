import { envs } from '../../config/envs'
import { CategoryModel, MongoDatabase, ProductModel, UserModel } from '../mongo'
import { seedData } from './data'





(async()=>{
   await MongoDatabase.connect({
        dbName: envs.MONGO_DB_NAME,
        mongoUrl: envs.MONGO_URL
    })
    await main()


    await MongoDatabase.disconnect()
})()

const randonBetween0And = (x: number) => {
    return Math.floor(Math.random() * x)
}


async function main (){

    // 0. Borrar todo!
    await Promise.all([
        UserModel.deleteMany(),
        CategoryModel.deleteMany(),
        ProductModel.deleteMany()
    ])


    // 1.Crear usuarios
    const users = await UserModel.insertMany( seedData.users)


    // 2. Crear categorias
    const categories = await CategoryModel.insertMany(
        seedData.categories.map( category =>{

            return {
                ...category,
                user: users[0]._id
            }
        } )
    )


    // 3.Crear Productos
    const products = ProductModel.insertMany(
        seedData.products.map( product => {
            return{
                ...product,
                user: users[randonBetween0And(seedData.users.length - 1 ) ]._id,
                category: categories[randonBetween0And(seedData.categories.length - 1) ]._id,
            }

        })

    )



    console.log('Seeded')
}