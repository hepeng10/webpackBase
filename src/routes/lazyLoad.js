import React, { Component, lazy } from 'react';

export default (route) => {
    return lazy(() => route.component);
};