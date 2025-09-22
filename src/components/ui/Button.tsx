import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';

const colorStyles = {
  primary:
    'bg-electric-blue text-pure-white hover:bg-blue-700 dark:bg-electric-blue dark:text-pure-white dark:hover:bg-blue-600',
  secondary:
    'text-insulation-black hover:bg-circuit-silver dark:bg-engineer-gray dark:text-circuit-silver dark:hover:bg-circuit-silver dark:hover:text-pure-white',
  filled:
    'bg-electric-blue text-pure-white hover:bg-blue-700 dark:bg-electric-blue dark:text-pure-white dark:hover:bg-blue-600',
  danger:
    'bg-high-voltage-orange text-pure-white hover:bg-orange-600 dark:bg-high-voltage-orange dark:text-pure-white dark:hover:bg-orange-500',
  amber:
    'bg-high-voltage-orange text-pure-white hover:bg-orange-600 dark:bg-high-voltage-orange dark:text-pure-white dark:hover:bg-orange-500',
  blue: 'bg-electric-blue text-pure-white hover:bg-blue-700 dark:bg-electric-blue dark:text-pure-white dark:hover:bg-blue-600',
  blue_filled:
    'bg-electric-blue text-pure-white hover:bg-blue-700 dark:bg-electric-blue dark:text-pure-white dark:hover:bg-blue-600',
  text: 'text-electric-blue hover:text-blue-700 dark:text-electric-blue dark:hover:text-blue-400',
  text_gray:
    'text-circuit-silver hover:text-insulation-black dark:text-circuit-silver dark:hover:text-pure-white',
  disabled: 'bg-circuit-silver text-pure-white cursor-not-allowed hover:bg-circuit-silver',
  light: 'bg-circuit-silver text-insulation-black hover:bg-engineer-gray',
  transparent:
    'bg-transparent text-insulation-black hover:bg-circuit-silver dark:text-circuit-silver dark:hover:bg-engineer-gray',
};

const shapeStyles = {
  default: 'rounded-md px-1 py-1',
  rounded: 'rounded-full px-1 py-1',
  outline:
    'px-1 py-1 ring-1 ring-inset ring-electric-blue/20 dark:ring-electric-blue/30 rounded-md',
  outline_wide:
    'px-2 py-1 ring-1 ring-inset ring-electric-blue/20 dark:ring-electric-blue/30 rounded-md',
  slim: 'rounded-md px-0.5 py-0.5 h-9 flex items-center justify-center',
};

type ButtonBaseProps = {
  color?: keyof typeof colorStyles;
  shape?: keyof typeof shapeStyles;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
  as?: 'button' | 'anchor';
};

export type ButtonAsButton = ButtonBaseProps & {
  as?: 'button';
  href?: undefined;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonAsAnchor = ButtonBaseProps & {
  as: 'anchor';
  href: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

interface ButtonProps extends ButtonBaseProps {
  as?: 'button' | 'anchor';
  href?: string;
}

type ButtonAttributes = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  keyof ButtonProps
>;
type AnchorAttributes = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof ButtonProps
>;

interface ButtonWithTooltipProps extends ButtonProps {
  tooltip?: React.ReactNode;
}

const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonWithTooltipProps & (ButtonAttributes | AnchorAttributes)
>((props, ref) => {
  const {
    as = 'button',
    color = 'primary',
    shape = 'default',
    className,
    children,
    href,
    disabled = false,
    tooltip,
    ...restProps
  } = props;

  const buttonColor = disabled ? 'disabled' : color;

  const buttonClassName = clsx(
    'inline-flex gap-0.5 justify-center overflow-hidden font-medium transition',
    colorStyles[buttonColor],
    shapeStyles[shape],
    className
  );

  let ButtonElement: React.ReactElement;

  if (as === 'anchor') {
    if (!href) {
      throw new Error(
        "The 'href' prop is required when using Button as 'anchor'."
      );
    }

    ButtonElement = (
      <Link href={href} passHref legacyBehavior>
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={buttonClassName}
          {...(restProps as AnchorAttributes)}
        >
          {children}
        </a>
      </Link>
    );
  } else {
    ButtonElement = (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        disabled={disabled}
        className={buttonClassName}
        {...(restProps as ButtonAttributes)}
      >
        {children}
      </button>
    );
  }

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{ButtonElement}</TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return ButtonElement;
});

Button.displayName = 'Button';

export { Button };
