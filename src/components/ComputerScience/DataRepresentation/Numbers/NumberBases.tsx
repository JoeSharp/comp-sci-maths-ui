import React from 'react';
import cogoToast from "cogo-toast";

import { generateRandomInteger, choose } from 'src/components/lib/utilities';
import { binary, hexadecimal, denary as denaryRaw, NumberBase } from 'comp-sci-maths-lib'
import useStreakCounter from 'src/components/lib/useStreakCounter';
import ProgressBar from 'src/components/Bootstrap/ProgressBar';
import NumberBaseConversionTable from './NumberBaseConversionTable';

// Correction to default value
const denary = denaryRaw.withPadding(1);

const MAX_VALUE = 255;
const TARGET_STREAK = 10;

interface Question {
    to: NumberBase,
    from: NumberBase,
    value: number,
}

const generateQuestion = (): Question => {
    let value = generateRandomInteger(0, MAX_VALUE);
    const from = choose([binary, denary, hexadecimal]);
    const to = choose([binary, denary, hexadecimal].filter(x => x !== from));
    return {
        value, from, to
    }
}

const NumberBases: React.FunctionComponent = () => {
    const [{ from, to, value }, regenerateQuestion] = React.useReducer(generateQuestion, generateQuestion());
    const { streak, onHit, onMiss } = useStreakCounter();

    const [answer, setAnswer] = React.useState<string>('');
    const onAnswerChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(({ target: { value } }) =>
        setAnswer(value)
        , [setAnswer]);

    React.useEffect(() => {
        if (streak === TARGET_STREAK) {
            cogoToast.info(`Well done on converting ${TARGET_STREAK} in a row. You have earnt some window staring time!`)
        }
    }, [streak])

    const onSubmit: React.MouseEventHandler = React.useCallback((e) => {
        const expected = to.toString(value);
        if (expected.toLowerCase() === answer.toLowerCase()) {
            cogoToast.info('Correct!');
            onHit();
        } else {
            cogoToast.error(`Incorrect ${from.toString(value)} in ${to.name} is actually ${expected}`);
            onMiss();
        }
        regenerateQuestion();
        e.preventDefault();
    }, [regenerateQuestion, onHit, onMiss, value, to, from, answer])

    return (<div className='row align-items-start'>
        <div className='col'>
            <h4>Convert {from.toString(value)}<sub>{from.symbols.length}</sub> into {to.name}</h4>
            <form>
                <div className='form-group'>
                    <label>Your Answer</label>
                    <input className='form-control' value={answer} onChange={onAnswerChange} />
                </div>
                <button onClick={onSubmit}>Submit</button>
            </form>

            <div>Try and get to a streak of {TARGET_STREAK} correct answers</div>
            <ProgressBar value={streak} max={TARGET_STREAK} />

        </div>
        <div className='col'>
            <h4>Table of Helpful Lookups</h4>
            <NumberBaseConversionTable from={from} to={to} />
        </div>
    </div>)
}

export default NumberBases;