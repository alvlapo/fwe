import { StringDataSource } from '../../src/js/engine/dom/parser/StringDataSource';

test('Next schould return chars', () => {
    let ds = new StringDataSource("ABC");

    expect(ds.next()).toBe("A");
    expect(ds.next()).toBe("B");
    expect(ds.next()).toBe("C");
    expect(ds.next()).toBe(null);
})

test('Next schould return null if source is empty', () => {
    let ds = new StringDataSource("");

    expect(ds.next()).toBe(null);
})

test('Lenght schould return null if source is empty', () => {
    let ds = new StringDataSource("ABCDEF");

    expect(ds.length).toBe(6);
})
