import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from '../../libs/dto/member/member';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { Message } from '../../libs/enums/common.enum';
import { MemberStatus } from '../../libs/enums/member.enum';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class MemberService {
    constructor(
		@InjectModel('Member') private readonly memberModel: Model<Member>,
		private authService: AuthService,
	) {}
    
	public async signup(input: MemberInput): Promise<Member> {
       	input.memberPassword = await this.authService.hashPassword(input.memberPassword);
        try {
            const result = await this.memberModel.create(input);
          	result.accessToken = await this.authService.createToken(result);
		    return result;
        } catch (err: any) {
			console.log('Error, Service.model:', err.message);
			throw new BadRequestException(Message.USED_MEMBER_NICK_OR_PHONE);
        }
	}

	public async login(input: LoginInput): Promise<Member> {
        const { memberNick, memberPassword } = input;
		// TODO: hal ql member typega oid hatoni
		const response: Member = (await this.memberModel
			.findOne({ memberNick: memberNick })
			.select('+memberPassword')
			.exec()) as Member;

		if (!response || response.memberStatus === MemberStatus.DELETE) {
			throw new InternalServerErrorException(Message.NO_MEMBER_NICK);
		} else if (response.memberStatus === MemberStatus.BLOCK) {
			throw new InternalServerErrorException(Message.BLOCKED_USER);
		}

		if (!response.memberPassword) {
			throw new InternalServerErrorException('Member password does not exist');
		}
		// TODO: Compare passwords
		const isMatch = await this.authService.comparePasswords(input.memberPassword, response.memberPassword);
		if (!isMatch) throw new InternalServerErrorException(Message.WRONG_PASSWORD);

		response.accessToken = await this.authService.createToken(response);

		return response;
	}

	public async updateMember(): Promise<string> {
		return 'updateMember exucuted';
	}

	public async getMember(): Promise<string> {
		return 'getMember exucuted';
	}

	public async getAllMembersByAdmin(): Promise<string> {
		return 'getAllMembersByAdmin exucuted';
	}

	public async updateMemberByAdmin(): Promise<string> {
		return 'updateMemberByAdmin exucuted';
	}
}