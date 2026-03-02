import { bcryptAdapter } from '../../config/bcrypt.adapter';
import { UserModel } from '../../data';
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from '../../domain';


export class AuthService{


    constructor(){}


    public async registerUser( registerUserDto: RegisterUserDto){

        const existUser = await UserModel.findOne({ email: registerUserDto.email });
        if(existUser) throw CustomError.badRequest('User already exists');

        try {
            const user = new UserModel(registerUserDto);
            
            //Encriptar la contraseña
            user.password = bcryptAdapter.hash(registerUserDto.password) 
            await user.save();


            // JWT



            // Enviar email de validación

            const { password, ...userEntity} = UserEntity.fromObject(user)

            return {
                user: userEntity,
                token: 'ABC'
            };
            
        } catch (error) {
            throw CustomError.internalServer('Error creating user');
        }

    }

    public async loginUser( loginUserDto: LoginUserDto){


        try {
            const existUser = await UserModel.findOne({ email: loginUserDto.email });
            if(!existUser) throw CustomError.badRequest('User not exists');
            // isMatch ... bcrypt compare (password, hashed)

            if(!bcryptAdapter.compare(loginUserDto.password, existUser.password)){
                throw CustomError.badRequest('Invalid credentials');
            }
            const { password, ...userEntity} = UserEntity.fromObject(existUser)
        
            return {
                user: userEntity,
                token: 'ABC'
            }
        } catch (error) {
            throw CustomError.internalServer('Error logging in user');
        }
        
    }

}