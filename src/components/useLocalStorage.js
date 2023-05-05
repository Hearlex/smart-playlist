import { use, useEffect, useState } from 'react';

const useLocalStorage = {
    store(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    retrieve(key) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    }
}

export default useLocalStorage;