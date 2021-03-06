import React from 'react';
import { denary as denaryRaw, binary as binaryRaw, hexadecimal as hexadecimalRaw } from "comp-sci-maths-lib";

const denary = denaryRaw.withPadding(1);
const binary = binaryRaw.withPadding(4);
const hexadecimal = hexadecimalRaw.withPadding(1);

const numberBases = [denary, binary, hexadecimal]

export interface UseConversionTable {
    headings: string[];
    values: { denaryValue: string, binaryValue: string, hexadecimalValue: string }[]
}

export default (): UseConversionTable => React.useMemo(() => {
    const values = [];

    for (let value = 0; value < 16; value++) {
        let denaryValue = denary.toString(value);
        let binaryValue = binary.toString(value);
        let hexadecimalValue = hexadecimal.toString(value);
        values.push({ denaryValue, binaryValue, hexadecimalValue });
    }

    return {
        headings: numberBases.map(n => n.name),
        values
    }
}, []);