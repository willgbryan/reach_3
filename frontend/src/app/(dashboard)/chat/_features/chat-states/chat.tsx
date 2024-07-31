'use client'

import React, { useState } from 'react'
import { ArrowUpIcon, Loader } from 'lucide-react'

import { DynamicContainer, DynamicDiv } from '@/components/cult/dynamic-blob'

export const ChatState = ({ disabled, value, handleClick, handleChange, loading }) => {
  const [inputValue, setInputValue] = useState(value)

  const onInputChange = (e) => {
    setInputValue(e.target.value)
    handleChange(e.target.value)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (e.target.length >= 1) {
      handleClick(inputValue)
      setInputValue('')
    }
  }

  return (
    <DynamicContainer>
      <div className="flex items-center justify-start pl-8">
        <DynamicDiv>
          <form onSubmit={onSubmit} className="group relative mt-4 flex items-center gap-4">
            <input
              type="text"
              autoComplete="false"
              value={inputValue}
              onChange={onInputChange}
              disabled={disabled}
              className="form-input rounded-md bg-black/0 py-2 pr-1 text-xl text-white transition duration-300 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-black/0 group-focus-within:border-white/10 sm:text-2xl"
              placeholder="ask anything"
            />

            <button
              type="submit"
              disabled={loading}
              className=" absolute -right-[120px]  -top-[19px] mt-[1px] rounded-l-md rounded-r-[39px]  border border-black/50 bg-offBlack-900 px-5 py-[29.8px] text-white transition duration-300 focus-within:border-white/10  focus:outline-none focus:ring-2  focus:ring-brand-500 group-focus-within:bg-offBlack-950 dark:group-focus-within:bg-[#212124] dark:bg-[#151517] md:-right-[93px] md:-top-[18.5px] md:py-[29.4px]"
            >
              {loading ? (
                <Loader className="animate-spin stroke-brand-400  md:mr-2" />
              ) : (
                <ArrowUpIcon className="stroke-neutral-600 group-focus-within:stroke-brand-500 dark:stroke-neutral-400 md:mr-2" />
              )}
            </button>
          </form>
        </DynamicDiv>
      </div>
    </DynamicContainer>
  )
}
