import { Router } from 'express';

import { AuthMiddleware } from '../middlewares/auth.middleware';
import { CategoryService } from '../services/category.service';
import { CategoryController } from '../file-upload/controller';





export class CategoryRoutes {


  static get routes(): Router {

    const categoryService = new CategoryService()
    const controller = new CategoryController(categoryService)
    const router = Router();

    // Definir las rutas
    router.get('/', controller.getCategories);
    router.post('/', [ AuthMiddleware.validateJWT ], controller.createCategory);






    return router;
  }


}

