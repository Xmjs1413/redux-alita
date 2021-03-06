/*
 * File: hook.js
 * Desc: hook api
 * File Created: 2019-07-05 09:41:10
 * Author: chenghao at <hao.cheng@karakal.com.cn>
 * ------
 * Copyright 2019 - present, karakal
 */
import { useCallback } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, shallowEqual, useSelector } from 'react-redux';
import { setAlitaState } from '../action';
import { transformState, transformStateLight } from '.';

/**
 * alitaCreator - set alita state
 */
export function useAlitaCreator() {
    const dispatch = useDispatch();
    return useCallback(
        (data, state) => {
            return bindActionCreators(setAlitaState.bind(null, data, state), dispatch)();
        },
        [dispatch]
    );
}

/**
 * get alita state from redux
 * @param {*} alitaStateKeys keys - extract alita single data
 * @example
 * eg: const { alita } = useAlitaState([{ alita: '测试' }]);
 * alita = { isFetching: false, data: '测试', timeStamp: xxx }
 */
export function useAlitaState(alitaStateKeys) {
    return useSelector(
        ({ alitaState }) => transformState(alitaState, alitaStateKeys),
        shallowEqual
    );
}

/**
 * 获取简洁的alita对象
 * @param {*} alitaStateKeys
 * @example
 * eg: const { alita } = useAlitaStateLight([{ alita: '测试' }]);
 * alita = '测试'
 */
export function useAlitaStateLight(alitaStateKeys) {
    return useSelector(
        ({ alitaState }) => transformStateLight(alitaState, alitaStateKeys),
        shallowEqual
    );
}

/**
 * 校验options
 * @param {*} options
 */
function validateOptions(options) {
    const keys = ['light'];
    return keys.some(key => options.hasOwnProperty(key));
}

/**
 *
 * @param  {...any} args
 * @example
 * args 可以传两个参数
 * 1
 */
export function useAlita(...args) {
    let options = args.slice(args.length - 1)[0];
    options = validateOptions(options) ? options : null;
    const stateKeys = options ? args.slice(0, args.length - 1) : args;
    const setAlita = useAlitaCreator();
    const alitaState =
        options && options.light ? useAlitaStateLight(stateKeys) : useAlitaState(stateKeys);
    return [...Object.keys(alitaState).map(key => alitaState[key]), setAlita];
}
