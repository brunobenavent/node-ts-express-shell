import { bcryptAdapter } from '../../config/bcrypt.adapter';
import { envs } from '../../config/envs';
import { JwtAdapter } from '../../config/jwt.adapter';
import { UserModel } from '../../data';
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from '../../domain';
import { EmailService } from './email.service';


export class AuthService{


    constructor(
        private readonly emailService: EmailService

    ){}


    public async registerUser( registerUserDto: RegisterUserDto){

        const existUser = await UserModel.findOne({ email: registerUserDto.email });
        if(existUser) throw CustomError.badRequest('User already exists');

        try {
            const user = new UserModel(registerUserDto);
            
            //Encriptar la contraseña
            user.password = bcryptAdapter.hash(registerUserDto.password) 
            await user.save();



            // Enviar email de validación

            await this.sendEmailValidationLink(user.email);

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
    private sendEmailValidationLink = async (email:string) => {
        const token = await JwtAdapter.generateToken({email})
        if(!token) throw CustomError.internalServer('Error generating token for email validation');

        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
        const html = `
            <h1>Email Validation</h1>
            <p>Please click the following link to validate your email:</p>
            <a href="${link}">Validate Email</a>
        `
        const options = {
            to: email,
            subject: 'Email Validation',
            htmlBody: html,
        }

        const isSent = await this.emailService.sendEmail(options);
        if(!isSent) throw CustomError.internalServer('Error sending email validation');

        return true;

    }

    public validateEmail = async ( token: string ) => {
        const payload = await JwtAdapter.validateToken(token);
        if(!payload) throw CustomError.badRequest('Invalid token');

        const { email } = payload as { email: string };
        if(!email) throw CustomError.internalServer('Email not found in token');

        const user = await UserModel.findOne({ email });
        if(!user) throw CustomError.internalServer('Email not exists');

        user.emailValidated = true;
        await user.save();
        
        return true;
        
    }

}