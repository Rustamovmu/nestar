import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from '../../libs/dto/member/member';
import { MemberInput } from '../../libs/dto/member/member.input';

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

	public async login(): Promise<string> {
		return 'login exucuted';
	}

	public async updateMember(): Promise<string> {
		return 'updateMember exucuted';
	}

	public async getMember(): Promise<string> {
		return 'getMember exucuted';
	}
}