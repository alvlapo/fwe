export class Stream<T> implements Iterator<T, undefined>, Iterable<T> {

    protected index = 0;

    constructor(protected data: T[]) {}

    [Symbol.iterator](): Iterator<T> {
        return this;
    }

    next() {
        let done = this.data.length == 0 || this.index == this.data.length
        let value: T | undefined = done ? undefined : this.data[this.index]
        
        this.index++

        return { done, value } as IteratorResult<T, undefined>
    }

}