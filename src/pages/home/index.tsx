import { Heading, Text } from '@ignite-ui/react'
import { Container, Hero, Preview } from './styles'
import appPreview from '../../assets/app-preview.png'
import Image from 'next/image'
import { ClaimUsernameForm } from './components/ClaimUsernameForm'

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
