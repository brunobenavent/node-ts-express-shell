


export class CreateCategoryDto {
    public readonly name: string;
    public readonly available: boolean;
    private constructor( name: string, available: boolean ){
        this.name = name
        this.available = available
    }

    static create ( object : { [key: string]: any} ): [string? , CreateCategoryDto? ] {
        const { name, available = false } = object
        let availableBoolean = available

        if(!name) return ['Missing name']
        if(typeof available !== 'boolean'){

            availableBoolean = (available==='true' ? true: false)
        }
        return [ undefined, new CreateCategoryDto(name, availableBoolean) ]

    }


    
}