# Data Shape - Educational AI Assistant Platform

## Overview

This platform enables teachers and educators to build AI agents specialized for educational tasks. The data model focuses on domain-specific educational data including classroom characteristics, teacher profiles, curriculum standards, and subject topics.

## Core Entities

### Educational Domain

An area of educational expertise that can be selected when building an agent. Each domain has a schema defining form fields for configuration.

**Domains:**
- `Classroom Management` - Class characteristics, student demographics, learning environment
- `Teacher Profile` - Teacher experience, specialization, teaching preferences
- `Curriculum Standards` - Standards alignment, pacing, assessment methods
- `Subject Topics` - Topic breakdowns and content areas by subject

### AgentConfig

A saved educational AI agent configuration containing:
- Selected educational domains
- Form field values (classroom info, teacher profile, curriculum, topics)
- Enabled educational tools
- Runtime fields for dynamic configuration
- Attached flows with slash commands

### Agent Types

The platform includes three pre-configured agent templates:

1. **LessonPlanAgent** (`/generate`)
   - Creates comprehensive lesson plans aligned to standards
   - Domains: Classroom, Teacher, Curriculum, Subjects
   - Flow: `flow_lesson_generate` - Produces structured lesson plan with objectives, activities, assessments, differentiation

2. **AssessmentAgent** (`/generate`)
   - Designs formative and summative assessments
   - Domains: Curriculum, Subjects, Classroom
   - Flow: `flow_assessment_generate` - Produces assessment with items, answer key, rubric, accommodations

3. **TeamBuildingAgent** (`/generate`)
   - Creates collaborative learning activities and team-building exercises
   - Domains: Classroom, Teacher, Subjects
   - Flow: `flow_teambuild_generate` - Produces session plan with activities, grouping, reflections

### PromptFragment

A markdown file in the prompt library containing educational knowledge, teaching strategies, or behavioral guidelines. Organized into categories:
- `lesson-planning/` - Lesson structure, standards alignment, differentiation
- `assessment/` - Assessment types, rubric design, DOK levels
- `collaboration/` - Grouping strategies, SEL integration
- `templates/` - Reusable lesson plan templates

### Tool

An educational capability that agents can invoke:

**Curriculum Tools:**
- `standards-alignment-checker` - Validates against CCSS, NGSS, TEKS, state frameworks
- `resource-library-search` - Searches OER and educational resource libraries
- `question-bank` - Access to standards-aligned assessment items

**Assessment Tools:**
- `assessment-generator` - Creates quizzes, tests, performance tasks
- `rubric-generator` - Creates scoring rubrics
- `accommodation-suggester` - IEP/504 accommodations and modifications

**Teaching Tools:**
- `activity-database` - Team-building and collaborative activities
- `grouping-strategy` - Student grouping recommendations
- `reflection-prompt-generator` - SEL and metacognitive reflection prompts
- `differentiation-helper` - Tomlinson model differentiation strategies

### Flow

A sequential multi-step workflow triggered by a slash command. Each agent has a `/generate` flow:

**Flow Structure - Gradual Section Generation:**
Each task generates a specific section of the final output:

1. `updateFlowOutput` - Task 1: Generate overview/title section
2. `updateFlowOutput` - Task 2: Generate first content section (objectives, items, or goals)
3. `updateFlowOutput` - Task 3-N: Generate subsequent sections one per task
4. Final task: Generate closing section (differentiation, accommodations, or reflections)

**LessonPlanAgent Flow (8 tasks):**
- Task 1: Overview (title, grade, subject, duration)
- Task 2: Objectives & Standards
- Task 3: Materials & Preparation
- Task 4: Opening Section
- Task 5: Instruction Section
- Task 6: Practice Sections (guided + independent)
- Task 7: Closure & Assessment
- Task 8: Differentiation Strategies

**AssessmentAgent Flow (6 tasks):**
- Task 1: Overview
- Task 2: Assessment Items
- Task 3: Answer Key
- Task 4: Scoring Rubric
- Task 5: Accommodations
- Task 6: Administration Guide

**TeamBuildingAgent Flow (5 tasks):**
- Task 1: Overview
- Task 2: Goals & Target Skills
- Task 3: Activities
- Task 4: Grouping Strategy
- Task 5: Reflection Prompts

### SlashCommand

A command trigger (`/generate`) that invokes the agent's flow to produce structured content:
- LessonPlanAgent `/generate` → Complete lesson plan JSON
- AssessmentAgent `/generate` → Complete assessment JSON
- TeamBuildingAgent `/generate` → Complete session plan JSON

### Workspace

A shared environment for a school or district containing:
- Teachers and staff (users with admin/editor/viewer roles)
- Shared prompt library
- Agent configurations
- Educational tools and integrations

## Educational Domain Data

### Classroom Characteristics
- Grade Level (K-12)
- Class Size (Small/Medium/Large/Very Large)
- Student Support Needs (ELL, Special Ed, Gifted, Interventions)
- Learning Model (In-Person/Hybrid/Remote/Flipped)
- Available Resources (1:1 devices, interactive whiteboard, lab, etc.)

### Teacher Profile
- Years of Experience (Novice to Expert)
- Subject Expertise (Math, ELA, Science, Social Studies, etc.)
- Teaching Style (Direct Instruction, Inquiry-Based, PBL, etc.)
- Certifications (General Elementary, Subject-Specific, Special Ed, ESL)
- Professional Development Goals

### Curriculum per Grade
- Curriculum Framework (CCSS, NGSS, TEKS, State, IB, Cambridge)
- Assessment Methods (Formative, Summative, Portfolio, Performance)
- Pacing Guide considerations
- Differentiation requirements
- Current unit/topic focus (runtime configurable)

### Topics per Subject
- Primary Subject (Math, ELA, Science, Social Studies, etc.)
- Specific topics within subject
- Target skill level (Introduction to Extension)
- Cross-curricular connections (Literacy, Numeracy, SEL, etc.)
- Essential questions

## Relationships

```
Workspace
├── has many WorkspaceUsers (teachers, staff)
├── has many AgentConfigs (LessonPlanAgent, AssessmentAgent, TeamBuildingAgent)
├── has many PromptFragments (organized by educational topic)
├── has many ToolPackages (educational tool integrations)
└── has many Flows (slash command workflows)

AgentConfig
├── references many Domains (4 educational domains)
├── has formValues (classroom, teacher, curriculum, topics data)
├── has many EnabledTools (educational capabilities)
├── has many RuntimeFields (dynamic configuration)
├── has many SlashCommands (triggers for flows)
└── generates one Agent (deployed instance)

Agent
├── has many Conversations
├── has many SlashCommands
├── has systemPrompt (assembled from domains and form values)
└── has many EnabledTools

Flow
├── belongs to Workspace (or Agent)
├── has many Tasks (in sequence)
├── triggered by SlashCommand
└── produces structured output

Task
├── type: updateFlowOutput OR executeTask
├── receives input from previous task
├── can enable tools
└── can define task instructions

SlashCommand
├── belongs to one Agent
├── triggers one Flow
└── enables structured content generation
```

## Structured Output Examples

### `/generate` on LessonPlanAgent produces (8 tasks):

**Task 1 - Overview:**
```json
{
  "overview": {
    "title": "Introduction to Fractions",
    "gradeLevel": "5th Grade",
    "subject": "Mathematics",
    "duration": 60,
    "overview": "..."
  }
}
```

**Task 2 - Objectives:**
```json
{
  "objectives": {
    "learningObjectives": ["..."],
    "standards": ["5.NF.A.1"],
    "essentialQuestion": "...",
    "successCriteria": ["..."]
  }
}
```

**Task 3 - Materials:**
```json
{
  "materials": {
    "materials": ["..."],
    "preparation": ["..."],
    "resources": ["..."]
  }
}
```

**Tasks 4-7** generate the opening, instruction, practice, closure/assessment sections.

**Task 8 - Differentiation:**
```json
{
  "differentiation": {
    "sectionTitle": "Differentiation Strategies",
    "sectionInstructions": "...",
    "strategies": [...],
    "extensions": [...]
  }
}
```

### `/generate` on AssessmentAgent produces (6 tasks):

**Task 1 - Overview:**
```json
{
  "overview": {
    "title": "Fractions Quiz",
    "assessmentType": "quiz",
    "gradeLevel": "5th Grade",
    "overview": "..."
  }
}
```

**Task 2 - Items:**
```json
{
  "items": {
    "sectionTitle": "Assessment Items",
    "sectionInstructions": "...",
    "items": [...]
  }
}
```

**Tasks 3-6** generate answer key, rubric, accommodations, and administration guide.

### `/generate` on TeamBuildingAgent produces (5 tasks):

**Task 1 - Overview:**
```json
{
  "overview": {
    "title": "Communication Skills Building",
    "gradeLevel": "6th Grade",
    "overview": "..."
  }
}
```

**Task 2 - Goals:**
```json
{
  "goals": {
    "sectionTitle": "Goals & Skills",
    "sessionGoals": ["..."],
    "targetSkills": ["..."],
    "essentialQuestion": "..."
  }
}
```

**Tasks 3-5** generate activities, grouping strategy, and reflection prompts.
