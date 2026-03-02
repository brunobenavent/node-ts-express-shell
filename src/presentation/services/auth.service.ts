import { bcryptAdapter } from '../../config/bcrypt.adapter';
import { JwtAdapter } from '../../config/jwt.adapter';
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



            // Enviar email de validación

            const { password, ...userEntity} = UserEntity.fromObject(user)
            const token = await JwtAdapter.generateToken({id: user.id})
            if(!token) throw CustomError.internalServer('Error generating token');
            return {
                user: userEntity,
                token
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

            const token = await JwtAdapter.generateToken({id: existUser.id})
            if(!token) throw CustomError.internalServer('Error generating token');
        
            return {
                user: userEntity,
                token
            }
        } catch (error) {
            throw CustomError.internalServer('Error logging in user');
        }
        
    }

}