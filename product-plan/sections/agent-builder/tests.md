# Test Specs: Agent Builder

These test specs are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, etc.).

## Overview

The Agent Builder is a form-centric control panel where users configure specialized agents by selecting domains and filling out auto-generated forms. Features multi-domain selection, dynamic form generation, live prompt preview, and saved agent management.

---

## User Flow Tests

### Flow 1: Create a New Agent

**Scenario:** User creates a new agent by selecting domains and filling out the form

#### Success Path

**Setup:**
- Builder is loaded with available domains
- No agent is currently being edited (fresh state)
- Saved agents list may contain previous configurations

**Steps:**
1. User opens Agent Builder
2. User sees domain catalog on the left with categories (Security, Infrastructure, Compliance, etc.)
3. User clicks on "Cybersecurity" domain
4. User clicks on "Data Privacy" domain (multi-select)
5. Both domains show as selected with violet highlight
6. Configuration form appears on the right with fields from both domains
7. User fills in required fields:
   - "Assessment Scope" (textarea): "Customer-facing web application"
   - "Compliance Standards" (multiselect): Selects "SOC 2", "GDPR"
   - "Minimum Severity" (select): Selects "Medium"
   - "Jurisdictions" (multiselect): Selects "EU (GDPR)", "California (CCPA/CPRA)"
   - "Data Categories" (textarea): "User names, email addresses"
8. User sees prompt preview panel updating with generated prompt
9. User clicks "Save Agent" button
10. User enters agent name "Security Auditor" in modal
11. User enters description "Combined cybersecurity and data privacy agent"
12. User clicks "Save"
13. **Outcome:** New agent appears in saved agents list

**Expected Results:**
- [ ] Domain catalog shows all available domains grouped by category
- [ ] Clicking domains toggles selection state
- [ ] Multiple domains can be selected simultaneously
- [ ] Selected domains show visual indication (violet background/check icon)
- [ ] Form fields appear dynamically based on selected domains
- [ ] Required fields are marked with asterisk or label
- [ ] Prompt preview updates as user types
- [ ] Token count displays in preview panel
- [ ] Save button opens modal for name/description
- [ ] After save, agent appears in saved list with correct name

#### Failure Path: Validation Error on Save

**Steps:**
1. User selects one or more domains
2. User leaves required fields empty
3. User clicks "Save Agent"
4. User enters name and description
5. User clicks "Save" in modal

**Expected Results:**
- [ ] Validation errors appear inline on required fields
- [ ] Error message: "Please fill in all required fields"
- [ ] Modal closes, form remains open
- [ ] Agent is not saved to the list

### Flow 2: Edit an Existing Agent

**Scenario:** User loads a previously saved agent and modifies it

#### Success Path

**Setup:**
- Saved agents list contains "Security Auditor" agent
- Agent has existing domain selections and form values

**Steps:**
1. User opens Agent Builder
2. User sees saved agents list in sidebar
3. User clicks on "Security Auditor" in the list
4. Form populates with previously saved values
5. Selected domains (Cybersecurity, Data Privacy) show as selected
6. User changes "Minimum Severity" from "Medium" to "High"
7. User sees prompt preview update
8. User clicks "Save" button
9. **Outcome:** Agent configuration is updated with new values

**Expected Results:**
- [ ] Clicking saved agent loads its configuration
- [ ] All form fields populate with saved values
- [ ] Domain selections match saved configuration
- [ ] Prompt preview shows saved agent's prompt
- [ ] Modified after save shows updated timestamp
- [ ] Agent remains at same position in list (not re-added)

### Flow 3: Browse Domains Without Saving

**Scenario:** User explores domains to see available options

#### Success Path

**Setup:**
- Builder is loaded in fresh state

**Steps:**
1. User opens Agent Builder
2. User browses domain categories
3. User clicks "Cloud Architecture" to see form fields
4. User fills in sample values to preview prompt
5. User clicks "New Agent" button
6. **Outcome:** Form clears to empty state, no save occurs

**Expected Results:**
- [ ] Domain categories show as section headers
- [ ] Each domain shows description and tags
- [ ] Selecting domain shows its form fields immediately
- [ ] Preview updates as user enters sample values
- [ ] Clicking "New Agent" clears form without confirmation
- [ ] No agent is added to saved list

### Flow 4: Delete a Saved Agent

**Scenario:** User deletes a previously saved agent configuration

#### Success Path

**Setup:**
- Saved agents list contains "Draft SOC Analyst" agent

**Steps:**
1. User opens Agent Builder
2. User hovers over "Draft SOC Analyst" in saved list
3. User clicks delete icon that appears
4. Confirmation modal appears: "Delete this agent configuration?"
5. User clicks "Delete"
6. **Outcome:** Agent is removed from saved list

**Expected Results:**
- [ ] Delete icon appears on hover in saved list
- [ ] Confirmation modal shows agent name
- [ ] After confirmation, agent disappears from list
- [ ] If deleted agent was loaded, form clears

---

## Empty State Tests

### No Domains Selected Empty State

**Scenario:** User hasn't selected any domains yet

**Setup:**
- Builder is loaded in fresh state
- No domains are selected

**Expected Results:**
- [ ] Right panel shows "No domains selected" message
- [ ] Helpful text: "Select one or more domains from the catalog to configure your agent"
- [ ] Domain catalog on left is fully visible and interactive
- [ ] Save button is disabled

### No Saved Agents Empty State

**Scenario:** No agents have been saved yet

**Setup:**
- Saved agents list is empty

**Expected Results:**
- [ ] Saved agents section shows "No saved agents" message
- [ ] Helpful text: "Your saved agent configurations will appear here"
- [ ] Section doesn't occupy excessive space when empty

---

## Component Interaction Tests

### Domain Catalog

**Renders correctly:**
- [ ] Shows domains grouped by category
- [ ] Each domain shows name, description, tags
- [ ] Selected domains have violet background
- [ ] Categories show as headers (Security, Infrastructure, etc.)

**User interactions:**
- [ ] Clicking domain toggles selection
- [ ] Multiple domains can be selected
- [ ] Clicking selected domain deselects it

### Configuration Form

**Renders correctly:**
- [ ] Field labels match schema definitions
- [ ] Required fields are marked
- [ ] Field types render correctly (text, textarea, select, multiselect, toggle)
- [ ] Default values populate from schema

**User interactions:**
- [ ] Typing in text fields updates form state
- [ ] Selecting from dropdowns updates selection
- [ ] Toggle switches between on/off
- [ ] Validation shows on blur or save attempt

### Prompt Preview

**Renders correctly:**
- [ ] Shows generated system prompt text
- [ ] Shows token count estimate
- [ ] Shows which domains are included
- [ ] Panel can be expanded/collapsed

**User interactions:**
- [ ] Preview updates as form values change
- [ ] Expand/collapse toggles panel size

---

## Edge Cases

- [ ] Handles selecting all available domains
- [ ] Handles deselecting all domains (shows empty state)
- [ ] Handles very long text in textarea fields
- [ ] Handles many saved agents (10+) with scrolling
- [ ] Handles concurrent edits (if multiple users)
- [ ] Preserves form state when switching between saved agents
- [ ] Handles schema with no fields (edge case)
- [ ] Handles schema with all optional fields

---

## Accessibility Checks

- [ ] All form fields have associated labels
- [ ] Validation errors are announced to screen readers
- [ ] Domain selection uses proper ARIA attributes
- [ ] Keyboard navigation works for all interactive elements
- [ ] Focus management works when opening modals
