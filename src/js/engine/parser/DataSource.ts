interface DataSource {
    
    length: number
    next(): null | string
    prev(): null | string
    curr(): null | string

}