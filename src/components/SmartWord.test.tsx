import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { detectErrors } from '../utils/detector';
import { SmartWord } from './SmartWord';

describe('عرض الحرف المستهدف', () => {
  it('لا يستخدم خطًا أحمر أو underline للكلمة المكتشفة', () => {
    render(<SmartWord detection={detectErrors('مدرسه')[0]} animate={false} />);
    const button = screen.getByRole('button', { name: /مراجعة كلمة مدرسه/ });
    expect(button).toHaveStyle({ textDecoration: 'none' });
    expect(button.className).not.toContain('underline');
  });
});
