import { Heading, Text } from '@ignite-ui/react'
import Image from 'next/image'

import appPreview from '../../assets/app-preview.png'
import { ClaimUsernameForm } from './components/ClaimUsernameForm'
import { Container, Hero, Preview } from './styles'

export default function Home() {
  return (
    <Container>
      <Hero>
        <Heading size="3xl">Agendamento descomplicado</Heading>
        <Text size="xl">
          Conecte seu calendário e permita que as pessoas marquem agendamentos
          no seu tempo livre.
        </Text>

        <ClaimUsernameForm />
      </Hero>
      <Preview>
        <Image
          src={appPreview}
          alt="Calendário Simbolizando a aplicação em andamento"
          height={400}
          quality={100}
          priority
        />
      </Preview>
    </Container>
  )
}
