import { Router } from 'express';




export class AuthRoutes {


  static get routes(): Router {

    const router = Router();
    
    // Definir las rutas
    router.use('/api/todos', /*TodoRoutes.routes */ );
    router.use('/api/todos', /*TodoRoutes.routes */ );
    router.use('/api/todos', /*TodoRoutes.routes */ );



    return router;
  }


}

