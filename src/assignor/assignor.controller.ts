import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { AssignorService } from './assignor.service';
import { CreateAssignorDto } from './dto/create-assignor.dto';
import { UpdateAssignorDto } from './dto/update-assignor.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller()
export class AssignorController {
  constructor(private readonly assignorService: AssignorService) {}

  @Post('integrations/assignor')
  create(@Body() createAssignorDto: CreateAssignorDto) {
    return this.assignorService.create(createAssignorDto);
  }

  @UseGuards(AuthGuard)
  @Get('integrations/assignors')
  findAll() {
    return this.assignorService.findAll();
  }

  @Get('integrations/assignor/:id')
  findOne(@Param('id') id: string) {
    return this.assignorService.findOne(id);
  }

  @Patch('integrations/assignor/:id')
  update(
    @Param('id') id: string,
    @Body() updateAssignorDto: UpdateAssignorDto,
  ) {
    return this.assignorService.update(id, updateAssignorDto);
  }

  @Delete('integrations/assignor/:id')
  async deleteAssignor(@Param('id') id: string) {
    await this.assignorService.softDelete(id);
  }
}
