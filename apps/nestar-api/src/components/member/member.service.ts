import { Injectable } from '@nestjs/common';

@Injectable()
export class MemberService {
	public async signup(): Promise<string> {
		return 'signup exucuted';
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