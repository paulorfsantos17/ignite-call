import { Button, Text, TextInput } from '@ignite-ui/react'
import { Form, FormAnnotations } from './style'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const claimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuário precisa ter no mínimo 3 letras.' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O usuário pode ter apenas letras e hifens',
    })
    .transform((username) => username.toLowerCase()),
})

type ClaimUsernameFormSchema = z.infer<typeof claimUsernameFormSchema>

export function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClaimUsernameFormSchema>({
    resolver: zodResolver(claimUsernameFormSchema),
  })

  function handleClaimUsername(data: ClaimUsernameFormSchema) {
    console.log(data)
  }

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput
          size="sm"
          prefix="ignite.com/"
          placeholder="seu-usuario"
          {...register('username')}
        />
        <Button size="sm" type="submit">
          Reservar
          <ArrowRight />
        </Button>
      </Form>
      <FormAnnotations>
        <Text>
          {errors.username
            ? errors.username.message
            : 'Digite o nome de usuário desejado.'}
        </Text>
      </FormAnnotations>
    </>
  )
}
