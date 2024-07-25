/**
 * @name:useDiscreteAPI
 * @description:使用独立API
 *
 *
 * */
import {computed, ref} from 'vue';
import type {ConfigProviderProps} from 'naive-ui';
import {createDiscreteApi, darkTheme, lightTheme} from 'naive-ui';

const themeRef = ref<'light' | 'dark'>('light');
const configProviderPropsRef = computed<ConfigProviderProps>(() => ({
    theme: themeRef.value === 'light' ? lightTheme : darkTheme
}));

const useDiscreteAPI = () => {
    return createDiscreteApi(
        ['message', 'dialog', 'notification', 'loadingBar', 'modal'],
        {
            configProviderProps: configProviderPropsRef
        }
    )

}
export default useDiscreteAPI;