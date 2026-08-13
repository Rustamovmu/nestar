import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from '../../libs/dto/member/member';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { Message } from '../../libs/enums/common.enum';
import { MemberStatus } from '../../libs/enums/member.enum';

@Injectable()
export class MemberService {
    constructor(@InjectModel('Member') private readonly memberModel: Model<Member>) {}
    
	public async signup(input: MemberInput): Promise<Member> {
        // TO DO: Hash password before saving to the database
        try {
            const result = await this.memberModel.create(input);
            // TO DO : Authentication via Tokens
		    return result;
        } catch (err) {
            console.error('Error in signup service:', err);
            throw new BadRequestException(err);
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

		// TODO: Compare passwords
		const isMatch = memberPassword === response.memberPassword;
		if (!isMatch) throw new InternalServerErrorException(Message.WRONG_PASSWORD);

		return response;
	}

	public async updateMember(): Promise<string> {
		return 'updateMember exucuted';
	}

	public async getMember(): Promise<string> {
		return 'getMember exucuted';
	}
}