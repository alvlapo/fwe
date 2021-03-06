export class StringDataSource implements DataSource {
    
    public readonly length: number;
    
    private index: number;
    private data: string;
    private code: number;

    constructor(source: string) {
        this.index = -1;
        this.data = source;
        this.length = source.length;
        this.code = -1;
    }

    curr() {
        this.code = this.data.charCodeAt(this.index);
        return this.data.charAt(this.index)
    }

    next() {
        this.index++;
        this.code = this.data.charCodeAt(this.index);
        return this.index < this.length? this.data.charAt(this.index) : null
    };

    prev() {
        this.index--;
        this.code = this.data.charCodeAt(this.index);
        return this.index > 0 ? this.data.charAt(this.index) : null
    }

}