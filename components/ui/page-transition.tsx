"use client"

import type * as React from "react"
import { motion, type HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

interface PageTransitionProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode
  animation?: "fade" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "scale" | "rotate"
  duration?: number
}

export function PageTransition({
  children,
  animation = "fade",
  duration = 0.5,
  className,
  ...props
}: PageTransitionProps) {
  const variants = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    "slide-up": {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
    "slide-down": {
      hidden: { opacity: 0, y: -20 },
      visible: { opacity: 1, y: 0 },
    },
    "slide-left": {
      hidden: { opacity: 0, x: 20 },
      visible: { opacity: 1, x: 0 },
    },
    "slide-right": {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0 },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1 },
    },
    rotate: {
      hidden: { opacity: 0, rotate: -2, scale: 0.98 },
      visible: { opacity: 1, rotate: 0, scale: 1 },
    },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants[animation]}
      transition={{ duration, ease: [0.16, 1, 0.3, 1] as const }}
      className={cn("w-full", className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

interface StaggerContainerProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode
  delay?: number
  stagger?: number
}

export function StaggerContainer({
  children,
  delay = 0,
  stagger = 0.08,
  className,
  ...props
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
      className={cn("w-full", className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode
  animation?: "fade" | "slide-up" | "slide-left" | "scale"
}

export function StaggerItem({
  children,
  animation = "slide-up",
  className,
  ...props
}: StaggerItemProps) {
  const itemVariants = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
    },
    "slide-up": {
      hidden: { opacity: 0, y: 16 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
    },
    "slide-left": {
      hidden: { opacity: 0, x: 16 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
    },
  }

  return (
    <motion.div variants={itemVariants[animation]} className={className} {...props}>
      {children}
    </motion.div>
  )
}
