import type { IndexableType } from 'dexie'
import { FormItemProp } from 'element-plus'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

import { Exercise } from '@/entities/exercise/exercise'
import { DBService } from '@/services/db/db'
import type {
  Validate,
  IExerciseForm
} from '@/stores/exercise-form/exercise-form.types'

export const useExerciseFormStore = defineStore(
  'exerciseForm',
  (): IExerciseForm => {
    const isDialogVisible = ref(false)

    //form
    const form = reactive({
      description: '',
      link: '',
      name: '',
      status: ''
    })

    const loading = ref(false)

    async function addExercise() {
      const exercise = new Exercise(form)
      loading.value = true

      try {
        const id = await dbService.addExercise(exercise)
        updateForm(id)
      } catch (error: unknown) {
        form.status = `Failed to add ${form.name}: ${error}`
      } finally {
        loading.value = false
      }
    }

    const dbService = new DBService()

    function updateForm(id: IndexableType) {
      form.status = `Exercise ${form.name} successfully added. Got id ${id}`
      form.name = ''
      form.description = ''
      form.link = ''
    }

    //isPropValid
    const isPropValid = reactive({
      name: true,
      link: true
    })

    function onValidate(prop: FormItemProp, isValid: boolean) {
      isPropValid[prop as keyof typeof isPropValid] = isValid
    }

    //validate
    let validate: Validate = null

    function setValidate(value: Validate) {
      validate = value
    }

    function add() {
      if (validate && !loading.value) {
        validate(validationCallback)
      }
    }

    function validationCallback(valid: boolean) {
      if (valid) {
        addExercise()
      }

      return !!valid
    }

    return {
      form,
      isDialogVisible,
      isPropValid,
      loading,
      add,
      onValidate,
      setValidate
    }
  }
)