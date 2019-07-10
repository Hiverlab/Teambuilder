export class FormModel {
	constructor(
		public category: string[],
    public production: boolean,
    public technical: boolean,
    public creative: boolean,
    public marketing: boolean,
    public admin: boolean,
    public others: boolean
	) {}
}
