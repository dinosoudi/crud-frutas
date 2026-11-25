from pydantic import BaseModel, ConfigDict, Field, model_validator


class FrutaCrear(BaseModel):
    nombre: str = Field(min_length=1, max_length=50)
    calificacion: int = Field(ge=1, le=10)


class Fruta(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str = Field(min_length=1, max_length=50)
    calificacion: int = Field(ge=1, le=10)


class FrutaPatch(BaseModel):
    nombre: str | None = Field(default=None, min_length=1, max_length=50)
    calificacion: int | None = Field(default=None, ge=1, le=10)

    @model_validator(mode="after")
    def check_at_least_one_field(self) -> "FrutaPatch":
        if not self.model_fields_set:
            raise ValueError("Debe incluir al menos un campo")
        if self.nombre is None and self.calificacion is None:
            raise ValueError("Debe incluir al menos un campo válido")
        return self
