/**
 * Form Component - Form Context & Field
 */

import React, { createContext, useContext } from 'react'
import { YStack, YStackProps, Text } from 'tamagui'

interface FormContextValue {
  errors: Record<string, string>
  values: Record<string, any>
  setFieldValue: (name: string, value: any) => void
  setFieldError: (name: string, error: string) => void
}

const FormContext = createContext<FormContextValue | null>(null)

export const useFormContext = () => {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useFormContext must be used within a Form')
  }
  return context
}

export interface FormProps extends YStackProps {
  onSubmit?: (values: Record<string, any>) => void
  initialValues?: Record<string, any>
}

export const Form: React.FC<FormProps> = ({ children, onSubmit, initialValues = {}, ...props }) => {
  const [values, setValues] = React.useState(initialValues)
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const setFieldValue = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    // Clear error when field changes
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const setFieldError = (name: string, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleSubmit = () => {
    onSubmit?.(values)
  }

  return (
    <FormContext.Provider value={{ errors, values, setFieldValue, setFieldError }}>
      <YStack space="$md" {...props}>
        {children}
      </YStack>
    </FormContext.Provider>
  )
}

export interface FormFieldProps extends YStackProps {
  name: string
  label?: string
  required?: boolean
  children: (props: {
    value: any
    onChange: (value: any) => void
    error?: string
  }) => React.ReactNode
}

export const FormField: React.FC<FormFieldProps> = ({ name, label, required, children, ...props }) => {
  const { values, errors, setFieldValue } = useFormContext()
  const value = values[name]
  const error = errors[name]

  return (
    <YStack space="$xs" {...props}>
      {label && (
        <Text fontSize={14} fontWeight="500" color="$text">
          {label}
          {required && (
            <Text color="$danger" marginLeft="$xs">
              *
            </Text>
          )}
        </Text>
      )}
      {children({ value, onChange: (val) => setFieldValue(name, val), error })}
      {error && (
        <Text fontSize={12} color="$danger">
          {error}
        </Text>
      )}
    </YStack>
  )
}
