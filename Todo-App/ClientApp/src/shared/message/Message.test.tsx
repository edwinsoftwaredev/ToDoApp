import React from 'react';
import {render} from "@testing-library/react";
import Message from "./Message";

describe('Message Comonent', () => {
  beforeEach(() => {
  });

  afterEach(() => {
  });

  test('should render', () => {
    const mockText = 'test';
    render(<Message text={mockText} />)
  });
});
