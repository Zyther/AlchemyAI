

<script lang="ts">
  import {
    Collapse,
    NavbarToggler,
    NavbarBrand,
    Nav,
    Navbar,
    NavItem,
    NavLink,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Styles
  } from '@sveltestrap/sveltestrap';

  let isOpen = false;

  function handleUpdate(event: CustomEvent) {
    isOpen = event.detail.isOpen;
  }
</script>

<Navbar color="light" light expand="md" container="md">
  <NavbarBrand href="/">AlchemyAI</NavbarBrand>
  <NavbarToggler on:click={() => (isOpen = !isOpen)} />
  <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
    <Nav class="ms-auto" navbar>
      <NavItem>
        <NavLink href="/">Home</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="/about">About</NavLink>
      </NavItem>
    </Nav>
  </Collapse>
</Navbar>
<slot />