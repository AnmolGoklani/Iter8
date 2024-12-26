import React from 'react';
import { render, screen } from '@testing-library/react';
import AssignmentList from './AssignmentList';

test('renders AssignmentList component', () => {
	render(<AssignmentList />);
	const linkElement = screen.getByText(/assignment/i);
	expect(linkElement).toBeInTheDocument();
});