import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(date)
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function generateAffiliateCode(name: string): string {
  const cleanName = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${cleanName.substring(0, 6)}${randomSuffix}`
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^(\+55|55)?[\s-]?\(?[1-9][1-9]\)?[\s-]?[0-9]{4,5}[\s-]?[0-9]{4}$/
  return phoneRegex.test(phone.replace(/\D/g, ''))
}

export function maskPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

export function getBusinessTypeLabel(type: string): string {
  const labels = {
    RESTAURANT: 'Restaurante/Pizzaria',
    MEDICAL: 'Consultório Médico',
    BEAUTY: 'Salão de Beleza',
    LEGAL: 'Escritório de Advocacia',
    RETAIL: 'Loja de Varejo',
    OTHER: 'Outros'
  }
  return labels[type as keyof typeof labels] || type
}

export function getSubscriptionStatusLabel(status: string): string {
  const labels = {
    TRIALING: 'Período de Teste',
    ACTIVE: 'Ativo',
    PAST_DUE: 'Pagamento Pendente',
    CANCELED: 'Cancelado',
    UNPAID: 'Não Pago',
    INCOMPLETE: 'Incompleto',
    INCOMPLETE_EXPIRED: 'Expirado'
  }
  return labels[status as keyof typeof labels] || status
}

export function calculateTrialDaysRemaining(trialEnd: Date): number {
  const now = new Date()
  const diffTime = trialEnd.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

export function isTrialExpired(trialEnd: Date): boolean {
  return new Date() > trialEnd
}

export function generateWebhookSecret(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}