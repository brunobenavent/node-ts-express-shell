import { Router } from 'express';




export class AuthRoutes {


  static get routes(): Router {

    const router = Router();
    
    // Definir las rutas
    router.post('/login', /*TodoRoutes.routes */ );
    router.post('/register', /*TodoRoutes.routes */ );

    router.get('/validate-email/:token', /*TodoRoutes.routes */ );



    return router;
  }


}

